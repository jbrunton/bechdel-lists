class Authorizer
  def initialize(user)
    @user = user
  end

  def can?(action, subject)
    validate_subject(subject)
    validate_action(action)

    if action == :read
      subject.public || is_owner?(subject)
    elsif action == :write
      is_owner?(subject)
    else
      raise "Unexpected action: #{action}"
    end
  end

  private

  def is_owner?(subject)
    !@user.nil? && @user == subject.user
  end

  def validate_action(action)
    raise "Unexpected action: #{action}" unless [:read, :write].include?(action)
  end

  def validate_subject(subject)
    raise "Unexpected type: #{subject.class}" unless subject.is_a?(List)
  end
end
